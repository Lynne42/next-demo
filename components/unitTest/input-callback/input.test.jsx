
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import InputComponent from "./input";

describe('unit test input component', () => {
  test("input component value", async () => {
    const handleChange = jest.fn();
    let inputValue = 'hello';
    render(<InputComponent inputValue={inputValue} handleChange={handleChange}/>);
    
    const input = screen.getByRole('textbox');
    expect(input.value).toBe('hello');

    await userEvent.type(input, 'world');

    expect(input.value).toBe('hello');
  });

  test("input component onChange", async () => {
    const handleChange = jest.fn();
    
    render(<InputComponent inputValue="" handleChange={handleChange}/>);
  
    const input = screen.getByRole('textbox');
  
    await userEvent.type(input, '12');
  
    expect(handleChange).toBeCalledTimes(2);
    
    await userEvent.type(input, '22000');
  
    expect(handleChange).toBeCalledTimes(7);
  
  });
});



