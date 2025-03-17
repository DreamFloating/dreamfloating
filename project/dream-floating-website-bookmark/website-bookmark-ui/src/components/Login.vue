<script setup lang="ts">
  import { t, language, switchLanguage, toggleDark, isDark, checkLanguage } from '@src/common/funcation'
  import { onMounted, onUnmounted, ref, reactive } from 'vue'
  import { AccountIcon, LockIcon } from 'mdi-vue3'
  import { ElLoading, ElMessage, FormInstance, FormRules } from 'element-plus'
  import instance from '@src/type-axios'
  import { ResponseResult } from '@src/common/interface'
  import { useRouter } from 'vue-router'
  import dayjs from 'dayjs'

  const router = useRouter()

  /**
   * 登录信息验证字段
   */
  interface LoginData {
    username: string
    password: string
  }

  /**
   * 登录信息
   */
  const loginData = reactive({
    username: '',
    password: ''
  })

  const loginFormRef = ref<FormInstance>()

  const loginRules = reactive<FormRules<LoginData>>({
    username: [{ required: true, message: t('rules_tip.username_required'), trigger: 'blur' }],
    password: [{ required: true, message: t('rules_tip.password_required'), trigger: 'blur' }]
  })

  /**
   * 登录
   */
  const login = async () => {
    if (!loginFormRef) return
    const loading = ElLoading.service({
      target: '#loginCard',
      body: true,
      fullscreen: true,
      lock: true,
      background: 'rgba(238, 238, 238, 0.5)',
      text: t('system.tip.login_loading')
    })
    await loginFormRef.value!.validate(async (valid, _fields) => {
      if (valid) {
        await instance
          .post('/login', null, {
            params: {
              username: loginData.username,
              password: loginData.password
            }
          })
          .then((response) => {
            const body = response.data as ResponseResult
            if (body.code === 200) {
              sessionStorage.setItem('Authorization', body.data.Authorization)
              sessionStorage.setItem('scope', body.data.scope)
              sessionStorage.setItem('jwtEffective', body.data.jwtEffective)
              sessionStorage.setItem('username', loginData.username)
              sessionStorage.setItem('tokenExpire', dayjs().format('YYYY-MM-DD HH:mm:ss'))
              ElMessage({
                type: 'success',
                plain: true,
                message: t('system.tip.login_response_success')
              })
              router.push('/')
            }
          })
          .finally(() => {
            loading.close()
          })
      } else {
        ElMessage({
          type: 'error',
          grouping: true,
          plain: true,
          message: t('rules_tip.login_valid_fail')
        })
      }
    })
    loading.close()
  }

  /**
   * 当焦点在用户名或密码输入框时回车登录
   * @param evt 键盘事件
   */
  const enterLogin = (evt: Event | KeyboardEvent) => {
    if (evt instanceof KeyboardEvent && evt.code === 'Enter') {
      login()
    }
  }

  // 组件挂载完成后加载
  onMounted(() => {
    checkLanguage()
  })

  // 组件卸载之后调用
  onUnmounted(() => {})
</script>
<template>
  <ElContainer class="default_container_style">
    <ElMain>
      <ElContainer class="default_container_style">
        <ElHeader class="container_body_header">
          <h1 class="header_title">{{ t('system.title') }}</h1>
        </ElHeader>
        <ElMain class="container_body_main">
          <ElCard
            id="loginCard"
            class="main_card">
            <ElContainer class="card_container">
              <ElHeader>
                <div style="float: right; height: 100%; display: flex">
                  <ElSpace>
                    <ElText>
                      {{ language }}
                    </ElText>
                    <ElDropdown trigger="click">
                      <ElButton
                        type="primary"
                        round>
                        <ElIcon size="32px">
                          <font-awesome-icon :icon="['fas', 'language']" />
                        </ElIcon>
                      </ElButton>
                      <template #dropdown>
                        <ElDropdownMenu>
                          <ElDropdownItem @click="switchLanguage('zh-cn')">{{ t('system.language.zh-cn') }}</ElDropdownItem>
                        </ElDropdownMenu>
                      </template>
                    </ElDropdown>
                    <ElButton
                      plain
                      circle
                      @click="toggleDark()">
                      <ElIcon v-if="!isDark">
                        <font-awesome-icon :icon="['fas', 'sun']" />
                      </ElIcon>
                      <ElIcon v-if="isDark">
                        <font-awesome-icon :icon="['fas', 'moon']" />
                      </ElIcon>
                    </ElButton>
                  </ElSpace>
                </div>
              </ElHeader>
              <ElMain>
                <ElContainer class="container_body">
                  <ElMain style="display: flex">
                    <div style="width: 60%; height: 80%; margin: auto">
                      <ElForm
                        style="margin-top: 2.5rem"
                        ref="loginFormRef"
                        :rules="loginRules"
                        :model="loginData"
                        label-position="top"
                        hide-required-asterisk
                        label-width="5rem">
                        <ElFormItem prop="username">
                          <ElInput
                            v-model="loginData.username"
                            :placeholder="t('placeholder.login_username')"
                            @keydown="enterLogin"
                            size="large"
                            maxlength="25"
                            clearable>
                            <template #prefix>
                              <ElIcon>
                                <AccountIcon />
                              </ElIcon>
                            </template>
                          </ElInput>
                        </ElFormItem>
                        <ElFormItem prop="password">
                          <ElInput
                            v-model="loginData.password"
                            :placeholder="t('placeholder.login_password')"
                            @keydown="enterLogin"
                            type="password"
                            size="large"
                            maxlength="25"
                            clearable
                            show-password>
                            <template #prefix>
                              <ElIcon>
                                <LockIcon />
                              </ElIcon>
                            </template>
                          </ElInput>
                        </ElFormItem>
                        <ElFormItem>
                          <ElSpace style="margin: auto">
                            <ElButton
                              type="primary"
                              size="large"
                              @click="login()">
                              {{ t('system.button.login') }}
                            </ElButton>
                          </ElSpace>
                        </ElFormItem>
                      </ElForm>
                    </div>
                  </ElMain>
                </ElContainer>
              </ElMain>
            </ElContainer>
          </ElCard>
        </ElMain>
      </ElContainer>
    </ElMain>
    <ElFooter class="container_body_footer">
      <div style="display: flex; height: 100%">
        <ElSpace class="footer_space">
          <ElLink
            :underline="false"
            href="https://github.com/DreamFloating/dreamfloating"
            target="_blank"
            >{{ t('system.link.about') }}
          </ElLink>
          <ElText> &copy;{{ t('system.copyright_info') }} </ElText>
          <ElText> {{ t('system.version') }} </ElText>
        </ElSpace>
      </div>
    </ElFooter>
  </ElContainer>
  <FirstUpdatePassword />
</template>
<style scoped lang="less">
  .container_body {
    width: 100%;
    height: 100%;
  }

  .container_body_header {
    margin: auto;
    height: auto;
    display: flex;
  }

  .container_body_main {
    display: flex;
    padding: 0;
  }

  .container_body_footer {
    height: auto;
    margin: 0.5rem;
  }

  .header_title {
    font-family: 'Courier New', Courier, monospace;
    text-shadow: 2px 1px 5px rgb(127, 127, 127);
    font-size: 2rem;
    cursor: pointer;
  }

  .main_card {
    margin: auto;
    width: 50rem;
    height: 30rem;
    background-color: transparent;
  }

  .card_container {
    width: 100%;
    height: 100%;
  }

  .footer_space {
    margin: auto;
    background-color: rgb(255, 255, 255);
  }
</style>
