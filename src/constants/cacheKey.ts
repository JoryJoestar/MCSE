const SYSTEM_NAME = "MCSE"

/** 缓存数据时用到的 Key */
class CacheKey {
    static TOKEN = `${SYSTEM_NAME}-token-key`
    static ACTIVE_THEME_NAME = `${SYSTEM_NAME}-active-theme-name-key`
    static MC_SKIN = `${SYSTEM_NAME}-mc-skin`
    static COLOR_SWATCHES = `${SYSTEM_NAME}-color-swatches`
    static CONTROLS_HISTORY = `${SYSTEM_NAME}-controls-history`
    static DRAFT_HISTORY = `${SYSTEM_NAME}-draft-history`
}


export default CacheKey
