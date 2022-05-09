import { render, screen } from "@testing-library/react";
import User from "./user";

/**
 * 测试点：UI测试
 * - props属性： name， email
 */

test('unit test fetch async user component', () => {

    const props = {
        name: "test",
        email: "test@111.com",
    }

    render(<User user={props}/>);

    
    const userName =  screen.getByTestId('unit-test-user-name');
    expect(userName).toBeInTheDocument();

    const userEmail =  screen.getByTestId('unit-test-user-email');
    expect(userEmail).toBeInTheDocument();
    
});