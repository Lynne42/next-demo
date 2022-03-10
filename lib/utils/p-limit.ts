import Queue from './queue';

export default function pLimit(limitNum: number) {
    // 判断并发限制数是否合理
	if (!((Number.isInteger(limitNum) || limitNum === Number.POSITIVE_INFINITY) && limitNum > 0)) {
		throw new TypeError('Expected `limitNum` to be a number from 1 and up');
	}

    // 队列实例
	const queue = new Queue();

    // 正在触发的异步任务数量
	let activeCount = 0;

    // 执行下一个异步任务
	const next = () => {
		activeCount--;
		if (queue.size > 0) {
			queue.dequeue()();
		}
	};

    // 执行异步任务
	const run = async (fn: any, resolve: any, args: any) => {
        // 正在执行的异步任务数+1
		activeCount++;

        // 执行异步任务函数， 返回一个promise
		const result = (async () => fn(...args))();
        
        // 返回异步任务执行结果
		resolve(result);

		try {
            // 等待任务执行结果
			await result;
		} catch {}

        // 任务执行完成后，取下一个任务执行
		next();
	};

	const enqueue = (fn: any, resolve: any, args: any) => {
        /**
         * run.bind(undefined, fn, resolve, args)
         * .bind方法创建一个新的函数,新函数的this指向undefined, fn, resolve, args参数作为新函数的参数
        */
        
        /***
         *  任务入队， 包括执行函数fn，函数执行后的结果返回(resolve), 其他参数args
         *  如果外面是for循环调用generator，则循环完成后，任务全部入队成功。
         *  for循环全部入队之后，此时没有其他同步任务，则会去取微任务执行， 即下面的执行判断函数
         */
		queue.enqueue(run.bind(undefined, fn, resolve, args));

        // for循环, 每一条都会生成一个微任务，进入微任务队列
		(async () => {
			// This function needs to wait until the next microtask before comparing
			// `activeCount` to `limitNum`, because `activeCount` is updated asynchronously
			// when the run function is dequeued and called. The comparison in the if-statement
			// needs to happen asynchronously as well to get an up-to-date value for `activeCount`.

            // 等待一个微任务周期
			await Promise.resolve();

            /**
             * 判断当前执行任务数是否小于并发限制数
             * 如果任务队列不为空，并且执行的任务数比并发限制数小， 则出队一个任务，并执行该任务
             * for循环结束执行刺猬任务判断，
             * 假设 limitNum = 3；queue.size = 100；
             * 首次 activeCount = 0, limitNum = 3，queue.size = 100， 满足条件， 出队一个任务(run函数)去执行，run函数内部 activeCount++， 执行要触发的函数， 等待一个微任务周期，等待函数结果
             * ...
             * 此时，再次取该处的微任务，activeCount=2， 满足条件， 出队一个任务(run函数)去执行
             * ...
             * 此时，再次取该处的微任务，activeCount=3， 不满足条件，等待正在执行中的任务的结果
             */ 
			if (activeCount < limitNum && queue.size > 0) {

                // 执行的是上面的类run函数
				queue.dequeue()();
			}
		})();
	};

	const generator = (fn: any, ...args: any) => new Promise((resolve: any) => {
        
		enqueue(fn, resolve, args);
	});

    // 在generator对象上定义新的属性和方法
	Object.defineProperties(generator, {
        // 正在执行的异步任务数
		activeCount: {
			get: () => activeCount,
		},
        // 等待执行的异步任务数
		pendingCount: {
			get: () => queue.size,
		},
        // 清除所有任务
		clearQueue: {
			value: () => {
				queue.clear();
			},
		},
	});

	return generator;
}
