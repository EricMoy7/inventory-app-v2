export const SET_USER = 'SET_USER';
export const SIGN_OUT = 'SIGN_OUT';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const NEED_VERIFICATION = 'NEED_VERIFICATION';
export const SET_SUCCESS = 'SET_SUCCESS';
export const SET_MWS = 'SET_MWS';

export const SET_IMPORT_HEADERS = 'SET_IMPORT_HEADERS';
export const SET_IMPORT_DATA = 'SET_IMPORT_DATA';

export interface User {
  firstName: string;
  email: string;
  id: string;
  createdAt: any;
}

export interface AuthState {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
  error: string;
  needVerification: boolean;
  success: string;
}

export interface SignUpData {
  firstName: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface ImportDataHeaders {
  headersObject: {
    asin?: string;
    cost?: string;
    listPrice?: string;
    supplier?: string;
    condition?: string;
    msku: string;
  };
  headers: [];
  hasUploaded: Boolean;
  [key: string]: string | Array<any> | Boolean | {};
  //TODO: Fix any on array index sig
}

export interface ImportData {
  [index: number]: string[];
}

export interface ParentCompProps {
  childComp?: React.ReactNode;
}

// Actions
interface SetImportHeadersAction {
  type: typeof SET_IMPORT_HEADERS;
  payload: ImportDataHeaders;
}

interface SetImportDataAction {
  type: typeof SET_IMPORT_DATA;
  payload: ImportData;
}

interface SetUserAction {
  type: typeof SET_USER;
  payload: User;
}

interface SetLoadingAction {
  type: typeof SET_LOADING;
  payload: boolean;
}

interface SignOutAction {
  type: typeof SIGN_OUT;
}

interface SetErrorAction {
  type: typeof SET_ERROR;
  payload: string;
}

interface NeedVerificationAction {
  type: typeof NEED_VERIFICATION;
}

interface SetSuccessAction {
  type: typeof SET_SUCCESS;
  payload: string;
}

export type AuthAction =
  | SetUserAction
  | SetLoadingAction
  | SignOutAction
  | SetErrorAction
  | NeedVerificationAction
  | SetSuccessAction;

export type ImportAction = SetImportHeadersAction;

export type ImportDataAction = SetImportDataAction;
