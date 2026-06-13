// Next.js Link will treat hrefs without a leading slash as relative. If you're on /manage and you use href="create-user", each click navigates to /manage/create-user, then /manage/create-user/create-user, etc.
// By making hrefs absolute (/create-user or /manage/create-user), clicks replace the path properly instead of appending.

export enum DashboardPagePath {
  LOGIN = "/login",
  CREATE_NEW_USER = "/manage/create-user",
  USERS_OVERVIEW = "/manage/users-overview",
  HOME = "/",
  MANAGE_QUESTIONS = "/manage/questions",
  MANAGE_COURSES = "/manage/courses",
  MANAGE = "/manage",
}
