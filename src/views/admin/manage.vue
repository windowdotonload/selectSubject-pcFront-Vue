<script>
import publicContiner from "@/views/publicContiner";
import { admin } from "@/router/index.js";

export default {
  extends: publicContiner,
  created() {
    // this.menuData = admin;
    // this.breadData = this.$route.matched;
  },
  data() {
    return {
      logintype: "admin",
      menuData: admin,
      breadData: this.$route.matched,
    };
  },
};
</script>