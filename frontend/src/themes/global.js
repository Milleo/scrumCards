import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`

  body,
  .dropdown-menu{
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
  }
  
  .navbar-light .navbar-brand {
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
  }
  .dropdown-toggle::after{
    border-top-color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
  }
  .dropdown-menu{
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
  }

  .navbar-brand a span{
    color: #0d6efd;
    font-size: 32px;
    font-weight: bold;
    line-height: 30px;
  }
  .navbar-brand a{
    color: #363537;
    line-height: 48px;
    text-decoration: none;
  }
`;