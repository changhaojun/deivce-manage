<template>
  <div class="user-login">
    <div class="user-login-bg" :style="{'background-image':`url(${backgroundImage})`}"></div>
    <div class="content-wrapper">
      <h2 class="slogan">
        欢迎使用 <br /> <span style="color:red">BOX</span> 生产管理系统
      </h2>
      <div class="form-container">
        <h4 class="form-title">登录</h4>
        <el-form ref="form" :model="user" label-width="0">
          <div class="form-items">
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="username" :rules="[ { required: true, message: '账号不能为空'}]">
                  <div class="form-line">
                    <i class="el-icon-edit-outline input-icon"></i>
                    <el-input placeholder="账号" v-model="user.username"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-col>
                <el-form-item prop="password" :rules="[ { required: true, message: '密码不能为空'}]">
                  <div class="form-line">
                    <i class="el-icon-service input-icon"></i>
                    <el-input type="password" placeholder="密码" v-model="user.password"></el-input>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class=form-item>
              <el-col>
                <el-form-item>
                  <el-checkbox class="checkbox"  v-model="checked">记住账号</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="form-item">
              <el-button type="primary" class="submit-btn" size="small" @click="submitBtn">
                登   录
              </el-button>
            </el-row>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import BasicContainer from '@vue-materials/basic-container';
const backgroundImage =
  'https://img.alicdn.com/tfs/TB1zsNhXTtYBeNjy1XdXXXXyVXa-2252-1500.png';
export default {
  components: { BasicContainer },
  name: 'UserLogin',

  data() {
    return {
      backgroundImage: backgroundImage,
      user: {
        username: '',
        password: '',
      },
      checked: true
    };
  },

  created() {},

  methods: {
   
    submitBtn() {
      this.$refs['form'].validate(async valid => {
        if(valid) {
          console.log(this.user);
          const res = await this.$http.post('login', this.user);
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          if(this.checked) {
            localStorage.setItem('userInfo', JSON.stringify(this.user));
          }else{
            localStorage.removeItem('userInfo', JSON.stringify(this.user));
          }
          const { result: {actk, fullname} } = res;
          sessionStorage.setItem('actk', actk);
          sessionStorage.setItem('fullname', fullname);
          
          this.$router.push({path: '/main'});
        }
      });
    },
  },
  created() {
    if(localStorage.getItem('userInfo')) {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      this.user = user;
    }
  }
};
</script>

<style lang="scss">
@import './UserLogin.scss';
</style>
