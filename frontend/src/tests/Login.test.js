import React from 'react';
import { render, history } from "./test-utils";
import { waitFor} from '@testing-library/react'
import Login from "../pages/Login";
import userEvent from '@testing-library/user-event';
import axios from "axios";

axios.defaults.baseURL = "http://backend:3001/"

let container, getByRole, getByLabelText, submitButton = null;

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
    beforeEach(() => {
        ({ container, getByLabelText, getByRole } = render(<Login onLogin={(data) => console.log(data)} />));
        submitButton = getByRole("button", { name: "Enter" });
    })
    it("Page loaded", () => {
        expect(container.querySelector("h2")).toHaveTextContent("Login");
        expect(container.querySelector("input[name='login']")).toBeInTheDocument();
        expect(container.querySelector("input[name='password']")).toBeInTheDocument();
        expect(getByRole("button", { name: "Enter" })).toBeInTheDocument();
    });
    it("Login successfully with e-mail account", async () => {
        const loginPayload = { login: "jest_user@gmail.com", password: "SomeStrongPassword#!123" }

        await waitFor(async () => {
            await userEvent.type(getByRole("textbox", { name: "login" }), loginPayload.email);
            await userEvent.type(getByLabelText("Password"), loginPayload.password);
            userEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(history.location.pathname).toEqual('/');
        });
    });
    it("Login successfully with username", async () => {
        const loginPayload = { login: "jest_user_1", password: "SomeStrongPassword#!123" }

        await waitFor(async () => {
            await userEvent.type(getByRole("textbox", { name: "login" }), loginPayload.login);
            await userEvent.type(getByLabelText("Password"), loginPayload.password);
            userEvent.click(submitButton);
        });

        await waitFor(() => {
            expect(history.location.pathname).toEqual('/');
        });
    });
    it("Tries to submit empty form", async () => {
        await waitFor(async () => {
            userEvent.click(submitButton);
        });

        const loginError = getByRole("textbox", { name: "login" }).parentElement.querySelector(".invalid-feedback");
        const passwordError = getByLabelText("Password").parentElement.querySelector(".invalid-feedback");

        expect(loginError).toHaveTextContent("Field required");
        expect(passwordError).toHaveTextContent("Field required");
    });
    it("Tries invalid username", async () => {
        await waitFor(async () => {
            await userEvent.type(getByRole("textbox", { name: "login" }), "@#()@#¨&*(@!#¨&(*#&$!(@");
            await userEvent.click(getByLabelText("Password"));
        });

        const loginError = getByRole("textbox", { name: "login" }).parentElement.querySelector(".invalid-feedback");

        expect(loginError).toHaveTextContent("Invalid username or e-mail");
    })
    it("Tries user that don't exists", async () => {
        const loginPayload = { login: "user_that_dosent_exists", password: "SomeStrongPassword#!123" }

        await waitFor(async () => {
            await userEvent.type(getByRole("textbox", { name: "login" }), loginPayload.login);
            await userEvent.type(getByLabelText("Password"), loginPayload.password);
            userEvent.click(submitButton);
        });

        await waitFor(() => {
            const alertBox = container.querySelector(".alert-danger");
            expect(alertBox).toBeInTheDocument();
            expect(alertBox).toHaveTextContent("Invalid user or password");
        });
    })
    it("Tries invalid password for user", async () => {
        const loginPayload = { login: "jest_user_1", password: "invalidpassword" }

        await waitFor(async () => {
            await userEvent.type(getByRole("textbox", { name: "login" }), loginPayload.login);
            await userEvent.type(getByLabelText("Password"), loginPayload.password);
            userEvent.click(submitButton);
        });

        await waitFor(() => {
            const alertBox = container.querySelector(".alert-danger");
            expect(alertBox).toBeInTheDocument();
            expect(alertBox).toHaveTextContent("Invalid user or password");
        });
    })
});