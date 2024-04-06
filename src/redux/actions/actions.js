import appConstants from './constants';

export const addItem = (data) => {
  console.log(data);
  return {
    type: appConstants.ADD_ITEM,
    payload: data,
  };
};

/** user activity */
export const userActivity = (data) => {
  return {
    type: appConstants.USER_ACTIVITY,
    payload: data,
  };
};

/** user login */
export const userLogin = (data) => {
  return {
    type: appConstants.USER_LOGIN,
    payload: data,
  };
};
