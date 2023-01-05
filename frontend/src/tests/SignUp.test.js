import React from 'react';
import { render, history } from "./test-utils";
import { waitFor} from '@testing-library/react'
import SignUp from "../layouts/SignUp";
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
        const { getByText } = render(<SignUp />);
    
        const title = getByText("Sign up");
        expect(title).toBeInTheDocument();
    });
    it("Submit the form with success", async () => {
        const formPayload = {
            name: "Jest user",
            userName: "jest_user_1",
            email: "jest_user@gmail.com",
            password: "SomeStrongPassword#!123"
        }
        const { getByRole, getByLabelText } = render(<SignUp />);
        const submitButton = getByRole("button", { name: "Cadastrar" });

        await userEvent.type(getByRole("textbox", { name: "name" }), formPayload.name);
        await userEvent.type(getByRole("textbox", { name: "userName" }), formPayload.userName);
        await userEvent.type(getByRole("textbox", { name: "email" }), formPayload.email);
        await userEvent.type(getByLabelText("Password"), formPayload.password);
        await userEvent.type(getByLabelText("Password confirmation"), formPayload.password);
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(history.location.pathname).toEqual('/login');
        });
    });
})

