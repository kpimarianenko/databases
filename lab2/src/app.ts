require('typescript-require');
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
import { ConsoleInterface } from './CI'

const CI : ConsoleInterface = new ConsoleInterface();

CI.init();
CI.show();