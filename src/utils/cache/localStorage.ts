/** 统一处理 localStorage */

import CacheKey from "@/constants/cacheKey"
import { type ThemeName } from "@/hooks/useTheme"
import { Favorites, TodoSpace, DateAccount, Schedule } from "@/types/projects"
class Cache {
  public name: string

  constructor() {
    this.name = 'localCache'
  }

  public set(key: string, value: any) {
    // console.log('set get', key, value)
    if (value) {
      try {
        window.localStorage.setItem(key, typeof value == 'object' ? JSON.stringify(value) : value)
      } catch (e) {
        window.localStorage.setItem(key, value)
      }
      return true
    } else {
      return false
    }
  }

  public get(key: string) {
    let result = window.localStorage.getItem(key)
    if (result) {
      try {
        return JSON.parse(result)
      } catch (e) {
        return result
      }
    }
    return undefined
  }

  public remove(key: string) {
    if (key) {
      window.localStorage.removeItem(key)
      return true
    } else {
      return false
    }
  }

  public clear() {
    window.localStorage.clear()
  }
}


export const cache = new Cache()

export const getActiveThemeName = () => {
  return cache.get(CacheKey.ACTIVE_THEME_NAME) as ThemeName
}
export const setActiveThemeName = (themeName: ThemeName) => {
  cache.set(CacheKey.ACTIVE_THEME_NAME, themeName)
}

export const getRainFx = () => {
  return cache.get(CacheKey.RAINFX) as boolean
}
export const setRainFx = (rainfx: string) => {
  cache.set(CacheKey.RAINFX, rainfx)
}

export const getTodoSpaces = () => {
  return cache.get(CacheKey.TODOSPACES) as TodoSpace[]
}
export const setTodoSpaces = (todoSpaces: TodoSpace[]) => {
  cache.set(CacheKey.TODOSPACES, todoSpaces)
}

export const getFavorites = () => {
  return cache.get(CacheKey.FAVORITES) as Favorites[]
}
export const setFavorites = (favorites: Favorites[]) => {
  cache.set(CacheKey.FAVORITES, favorites)
}

export const getAccount = () => {
  return cache.get(CacheKey.ACCOUNT) as DateAccount[]
}
export const setAccount = (favorites: DateAccount[]) => {
  cache.set(CacheKey.ACCOUNT, favorites)
}

// 本地保存皮肤
export const setSkin = (imageURL: string) => {
  cache.set(CacheKey.MCSKIN, imageURL);
}
// 返回皮肤
export const getSkin = () => {
  return cache.get(CacheKey.MCSKIN);
}

export const getSchedule = () => {
  return cache.get(CacheKey.SCHEDULE) as Schedule[]
}
export const setSchedule = (favorites: Schedule[]) => {
  cache.set(CacheKey.SCHEDULE, favorites)
}