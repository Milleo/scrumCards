import React from 'react';
import {toBeInTheDocument,toHaveStyle} from '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Loading from "../components/Loading";

test("Test sign up", () => {
    const { getByText } = render(<Loading />);

    const title = getByText("Loading...");
    expect(title).toBeInTheDocument();
})
