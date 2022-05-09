import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

import InputIndex from "./inputIndex";

test("call the callback every time input value is changed", async () => {
  const handleChange = jest.fn();
  render(<InputIndex />);

  const input = screen.getByRole("textbox");
  await userEvent.type(input, "1");

  expect(input.value).toBe("1");

  await userEvent.type(input, "2");

  expect(input.value).toBe("12");

});
