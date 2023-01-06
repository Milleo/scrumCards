import React from 'react';
import { render, history } from "./test-utils";
import { waitFor} from '@testing-library/react'
import Login from "../pages/Login";
import userEvent from '@testing-library/user-event';
import axios from "axios";

axios.defaults.baseURL = "http://backend:3001/"

describe("Sing up page tests", () => {
    beforeAll(() => {
        const mockHistoryPush = jest.fn();

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useHistory: () => ({
                push: mockHistoryPush,
            }),
        }));
    });
    it("Page loaded", () => {
        const { container, getByRole } = render(<Login />);
    
        expect(container.querySelector("h2")).toHaveTextContent("Login");
        expect(container.querySelector("input[name='login']")).toBeInTheDocument();
        expect(container.querySelector("input[name='password']")).toBeInTheDocument();
        expect(getByRole("button", { name: "Enter" })).toBeInTheDocument();
    });
});