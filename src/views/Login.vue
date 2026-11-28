<!-- =========================================================================================
  Garment Manufacturing ERP - Staff Login View
  File: src/views/Login.vue
  Reference: UI Design Document Page 3 (Screen · Login)
  Purpose:
    - Internal staff authentication screen.
    - Per SRS §1.4: "Internal staff only (customers cannot log in)".
    - Roles: Administrator, Garment Clerk, Purchasing Officer, Storekeeper, Production Officer, QA Officer.
    - Redirects authenticated staff to the ERP Dashboard or Dispatch Management.
========================================================================================== -->

<template>
  <div class="login-wrapper">
    <div class="login-card">
      <!-- ===================================================================================
           BRAND & HEADER SECTION
      ==================================================================================== -->
      <div class="login-header">
        <h2 class="erp-brand">GARMENT ERP</h2>
        <div class="erp-subtitle">Internal staff login</div>
      </div>

      <!-- ===================================================================================
           ERROR BANNER (SRS §8: Wrong credentials -> red banner, no hint which field failed)
      ==================================================================================== -->
      <div v-if="loginError" class="erp-banner banner-error">
        <span class="banner-icon">⚠️</span>
        <span>{{ loginError }}</span>
      </div>

      <!-- ===================================================================================
           AUTHENTICATION FORM
      ==================================================================================== -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Email Input Field -->
        <div class="form-group">
          <label class="form-label">Email<span class="required-star">*</span></label>
          <input
            type="email"
            v-model="email"
            class="form-control"
            placeholder="e.g. clerk@factory.lk"
            required
          />
        </div>

        <!-- Password Input Field with Toggle Visibility -->
        <div class="form-group">
          <label class="form-label">Password<span class="required-star">*</span></label>
          <div class="password-input-wrap">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              class="form-control"
              placeholder="••••••••••"
              required
            />
            <button
              type="button"
              class="toggle-pwd-btn"
              @click="showPassword = !showPassword"
              title="Show/hide password"
            >
              👁
            </button>
          </div>
        </div>

        <!-- Sign In Button (Teal #0e7490) -->
        <button type="submit" class="btn-primary-erp btn-login">
          Sign In
        </button>
      </form>

      <!-- ===================================================================================
           FOOTNOTE / ROLE RESTRICTION NOTICE
      ==================================================================================== -->
      <div class="login-footer">
        <p class="role-notice">
          Customers cannot log in · Roles: Administrator, Garment Clerk, Purchasing Officer, Storekeeper, Production Officer, QA Officer
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",

  data() {
    return {
      // Pre-filled sample staff email from wireframe Page 3
      email: "clerk@factory.lk",
      password: "password123",
      showPassword: false,
      loginError: "",
    };
  },

  methods: {
    /**
     * Simulates authentication verification and redirects to ERP
     */
    handleLogin() {
      if (!this.email || !this.password) {
        this.loginError = "Invalid email or password.";
        return;
      }
      // On successful credentials, navigate to Dispatch Management
      this.$router.push("/dispatch");
    },
  },
};
</script>

<style lang="scss" scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #12303b;
  padding: 20px;
  font-family: Inter, Helvetica, sans-serif;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 8px;
  padding: 32px 28px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);

  .login-header {
    text-align: center;
    margin-bottom: 22px;

    .erp-brand {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      color: #12303b;
      letter-spacing: 0.5px;
    }

    .erp-subtitle {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .password-input-wrap {
    position: relative;

    .toggle-pwd-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      color: #64748b;
    }
  }

  .btn-login {
    width: 100%;
    height: 38px;
    justify-content: center;
    font-size: 14px;
    margin-top: 8px;
  }

  .login-footer {
    margin-top: 20px;
    padding-top: 14px;
    border-top: 1px solid #e2e8f0;
    text-align: center;

    .role-notice {
      margin: 0;
      font-size: 11px;
      line-height: 1.5;
      color: #64748b;
    }
  }
}
</style>
