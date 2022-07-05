import Turkey from './turkey.interface';

class WildTurkey implements Turkey {
    gobble(): string {
        return 'wildTurkey gobble';
    }

    fly(): string {
        return 'wildTurkey fly';
    }
}

export default WildTurkey;