import React from 'react';
import { render, history } from "./test-utils";
import { waitFor} from '@testing-library/react'
import SignUp from "../pages/SignUp";
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
        const { container } = render(<SignUp />);
    
        const title = container.querySelector("h2");
        expect(title).toBeInTheDocument();
    });
    it.skip("Submit the form with success", async () => {
        const formPayload = {
            name: "Jest user",
            userName: "jest_user_1",
            email: "jest_user@gmail.com",
            password: "SomeStrongPassword#!123"
        }
        const { getByRole, getByLabelText } = render(<SignUp />);
        const submitButton = getByRole("button", { name: "Sign up" });

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
    it("Required fields", async () => {
        const requiredFields = ["Name", "E-mail", "Username", "Password", "Password confirmation"]
        const { getByRole, getByLabelText } = render(<SignUp />);
        userEvent.click(getByRole("button", { name: "Sign up" }));

        await waitFor(() => {
            expect(history.location.pathname).toEqual('/');
            for(field of requiredFields){
                const label = getByLabelText(field).closest("div");
                expect(label).toHaveTextContent("Field required");
            }
        });
    });
    it("Test name field", async () => {
        const { getByRole, getByLabelText } = render(<SignUp />);
        const nameField = getByRole("textbox", { name: "name" });
        const submitButton = getByRole("button", { name: "Sign up" });
        await userEvent.type(nameField, "aa");
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(getByLabelText("name").closest("div")).toHaveTextContent("The field should have at least 3 chars");
        });

        await userEvent.type(nameField, "a".repeat(101));
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(getByLabelText("name").closest("div")).toHaveTextContent("The field should have at maximum 100 chars");
        });
    });
    it("Test username field", async () => {
        const { getByRole, getByLabelText } = render(<SignUp />);
        const userNameField = getByLabelText("Username");
        await userEvent.type(userNameField, "aa");
        const submitButton = getByRole("button", { name: "Sign up" });
        userEvent.click(submitButton);
        

        await waitFor(() => {
            expect(userNameField.closest("div")).toHaveTextContent("The field should have at least 3 chars");
        });

        await userEvent.type(userNameField, "a".repeat(51));
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(userNameField.closest("div")).toHaveTextContent("The field should have at maximum 50 chars");
        });
    });
    it("Test email field", async () => {
        const { getByRole, getByLabelText } = render(<SignUp />);
        const emailField = getByLabelText("E-mail");
        await userEvent.type(emailField, "SomeInvalidEmailAccount@noWhere.");
        const submitButton = getByRole("button", { name: "Sign up" });
        
        userEvent.click(submitButton);
        

        await waitFor(() => {
            expect(emailField.closest("div")).toHaveTextContent("Invalid e-mail account");
        });

        await userEvent.type(emailField, "a".repeat(75) + "@email.com");
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(emailField.closest("div")).toHaveTextContent("The field should have at maximum 75 chars");
        });
    });
    it("Test password field", async () => {
        const { getByRole, getByLabelText } = render(<SignUp />);
        const passwordField = getByLabelText("Password");
        const defaultErrorMessage = "The password should have minimum of 8 chars and should contain letters(lowercase and uppercase), numbers and special symbols";
        const submitButton = getByRole("button", { name: "Sign up" });
        const feedback = passwordField.parentElement.querySelector(".invalid-feedback");

        await userEvent.type(passwordField, "invalidpassword");
        await userEvent.click(submitButton);
        await waitFor(() => {
            expect(feedback).toHaveTextContent(defaultErrorMessage);
        });

        userEvent.clear(passwordField);
        await userEvent.type(passwordField, "passwordWithUppercase");
        await userEvent.click(submitButton);
        await waitFor(() => {
            expect(feedback).toHaveTextContent(defaultErrorMessage);
        });

        userEvent.clear(passwordField);
        await userEvent.type(passwordField, "passwordWithNumbers12313");
        await userEvent.click(submitButton);
        await waitFor(() => {
            expect(feedback).toHaveTextContent(defaultErrorMessage);
        });

        userEvent.clear(passwordField);
        await userEvent.type(passwordField, "passwordWithNumbers12313!@#");
        await userEvent.click(submitButton);
        await waitFor(() => {
            expect(feedback).toBeEmptyDOMElement();
        });
    });
    it("Test password confirmation field", async () => {
        const { getByRole, getByLabelText } = render(<SignUp />);
        const passwordField = getByLabelText("Password");
        const passwordConfirmationField = getByLabelText("Password confirmation");
        const submitButton = getByRole("button", { name: "Sign up" });

        await userEvent.type(passwordField, "passwordValid#!123");
        await userEvent.type(passwordConfirmationField, "unmatchingPassword");
        userEvent.click(submitButton);
        await waitFor(() => {
            expect(passwordConfirmationField.closest("div")).toHaveTextContent("Passwords don't match");
        });
    });
    it("Tries to sign up with an email already in use", async() => {
        const formPayload = {
            name: "Jest user",
            userName: "jest_user_2",
            email: "jest_user@gmail.com",
            password: "SomeStrongPassword#!123"
        }
        const { getByRole, getByLabelText } = render(<SignUp />);
        const submitButton = getByRole("button", { name: "Sign up" });
        const feedback = getByRole("textbox", { name: "email" }).parentElement.querySelector(".invalid-feedback");

        await userEvent.type(getByRole("textbox", { name: "name" }), formPayload.name);
        await userEvent.type(getByRole("textbox", { name: "userName" }), formPayload.userName);
        await userEvent.type(getByRole("textbox", { name: "email" }), formPayload.email);
        await userEvent.type(getByLabelText("Password"), formPayload.password);
        await userEvent.type(getByLabelText("Password confirmation"), formPayload.password);
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(history.location.pathname).toEqual('/');
            expect(feedback).toHaveTextContent("E-mail is already registered");
        });
    });
    it("Tries to sign up with an username already in use", async() => {
        const formPayload = {
            name: "Jest user",
            userName: "jest_user_1",
            email: "jest_user_2@gmail.com",
            password: "SomeStrongPassword#!123"
        }
        const { getByRole, getByLabelText } = render(<SignUp />);
        const submitButton = getByRole("button", { name: "Sign up" });
        const feedback = getByRole("textbox", { name: "userName" }).parentElement.querySelector(".invalid-feedback");

        await userEvent.type(getByRole("textbox", { name: "name" }), formPayload.name);
        await userEvent.type(getByRole("textbox", { name: "userName" }), formPayload.userName);
        await userEvent.type(getByRole("textbox", { name: "email" }), formPayload.email);
        await userEvent.type(getByLabelText("Password"), formPayload.password);
        await userEvent.type(getByLabelText("Password confirmation"), formPayload.password);
        userEvent.click(submitButton);

        await waitFor(() => {
            expect(history.location.pathname).toEqual('/');
            expect(feedback).toHaveTextContent("Username already taken");
        });
    })
})

