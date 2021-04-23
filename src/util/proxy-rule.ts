const rules = {
  // 本地测试时使用
  // '/intelligent-modeling-service': 'http://10.15.82.28:8090/intelligent-modeling-service',
}

export const parseRule = (url: string) => {
  for (const [key, value] of Object.entries(rules)) {
    const reg = RegExp(key)
    if (reg.test(url)) {
      return url.replace(key, value)
    }
  }

  return url
}
