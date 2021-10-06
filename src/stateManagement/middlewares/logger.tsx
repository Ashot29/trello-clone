export const logger = (store: any) => (next: any) => (action: any) => {
  console.log("prev state", store.getState());
  console.log("dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  return result;
};