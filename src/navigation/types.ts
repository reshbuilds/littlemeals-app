export type RootStackParamList = {
  '(tabs)': undefined;
};

export type TabParamList = {
  log: undefined;
  insights: undefined;
  search: undefined;
  settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}