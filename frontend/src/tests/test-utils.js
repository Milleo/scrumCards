import React from 'react';
import {render as intlRender} from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import translations from "../i18n/en/translations";
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

const history = createMemoryHistory({ initialEntries: [['/']] });
function render(ui, {...renderOptions} = {}) {
    function Wrapper({children}) {
        return <IntlProvider messages={translations} locale="en">
            <Router history={history}>
                {children}
            </Router>
        </IntlProvider>;
    }
    return intlRender(ui, {wrapper: Wrapper, ...renderOptions});
}

export {history, render};