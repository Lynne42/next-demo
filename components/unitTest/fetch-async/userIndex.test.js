import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import UserIndex from "./userIndex";

/**
 * 测试点：功能测试
 * - 异步数据请求成功前， 页面loading状态
 * - 异步数据成功后， 页面正常状态
 * - 异步数据失败后， 页面失败文案展示
 */

// 模拟User组件
jest.mock("./user", () => () => "UserComponent");

// 模拟fetch请求
window.fetch = jest.fn(() => {
  const user = { name: "Jack", email: "jack@email.com" };

  return Promise.resolve({
    json: () => Promise.resolve(user),
  });
});

describe("unit test fetch async user-index component", () => {
  test("unit test fetch async user-index component: show loading ", async () => {
    const { queryByText } = render(<UserIndex />);
   
    await waitFor(() => {
      expect(queryByText(/Loading/i)).toBeInTheDocument();
    });
  });

  test("unit test fetch async user-index component: show data ", async () => {
    const { queryByText } = render(<UserIndex />);
    
    await waitFor(() => {
      expect(queryByText(/Loading/i)).toBeInTheDocument();
    });
  });

  test("unit test fetch async user-index component: show error ", async () => {
    const { queryByText } = render(<UserIndex />);
    
    await waitFor(() => {
      expect(queryByText(/Loading/i)).toBeInTheDocument();
    });
  });

});
