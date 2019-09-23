export function getCurrentAuthority() {
  // 这个函数进行用户校验，返回用户所有的权限
  return ["user"];
}

export function check(authority) {
  // authority: 传入所需要的权限
  //检查权限
  const current = getCurrentAuthority();
  //  list.some(item => string.includes(item)) 判断字符串是否在列表中存在
  return current.some(item => authority.includes(item));
}

export function isLogin() {
  // 判断用户是否登陆
  const current = getCurrentAuthority();
  return current && current[0] !== "guest";
}
