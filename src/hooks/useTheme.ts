import { ref, computed } from "vue"
import { getActiveThemeName, setActiveThemeName } from "@/utils/cache/localStorage"

const DEFAULT_THEME_NAME = "light"
type DefaultThemeNameType = typeof DEFAULT_THEME_NAME

/** 注册的主题名称, 其中 DefaultThemeNameType 是必填的 */
export type ThemeName = DefaultThemeNameType | "dark"

interface IThemeList {
  title: string
  name: ThemeName
}

/** 主题列表 */
const themeList: IThemeList[] = [
  {
    title: "白天",
    name: DEFAULT_THEME_NAME
  },
  {
    title: "黑夜",
    name: "dark"
  }
]

/** 正在应用的主题名称 */
const activeThemeName = ref<ThemeName>(getActiveThemeName() || DEFAULT_THEME_NAME)

const initTheme = () => {
  setHtmlClassName(activeThemeName.value)
}

const setTheme = (value: ThemeName) => {
  activeThemeName.value = value
  setHtmlClassName(value)
  setActiveThemeName(value)
}


const themeUpdate = () => {
  if (activeThemeName.value === 'light') {
    setTheme('dark' as ThemeName)
  } else if (activeThemeName.value === 'dark') {
    setTheme('light' as ThemeName)
  } else {
    console.warn('该主题暂时不支持！')
  }

}

const setHtmlClassName = (value: ThemeName) => {
  document.documentElement.className = value
}

const isDark = computed(() => activeThemeName.value === 'dark')

/**
 * 主题动画切换
 * @see https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
 * @see https://github.com/vuejs/vitepress/pull/2347/files
 * @param event event
 */
const toggleDark = (event?: MouseEvent) => {
  // @ts-expect-error experimental API
  const isAppearanceTransition = document.startViewTransition
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // 如果不支持
  if (!isAppearanceTransition || !event) {
    themeUpdate()
    return
  }

  const x = event.clientX
  const y = event.clientY
  
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  )
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    themeUpdate()
    await nextTick()
  })
  transition.ready
    .then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      document.documentElement.animate(
        {
          clipPath: isDark.value
            ? [...clipPath].reverse()
            : clipPath,
        },
        {
          duration: 400,
          easing: 'ease-out',
          pseudoElement: isDark.value
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        },
      )
    })
}


/** 主题 hook */
export const useTheme = () => {
  return { themeList, activeThemeName, initTheme, setTheme, toggleDark, isDark }
}
