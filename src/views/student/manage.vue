<script>
import publicContiner from "@/views/publicContiner";
import { student } from "@/router/index.js";

export default {
  extends: publicContiner,
  data() {
    return {
      logintype: "student",
      menuData: student,
      breadData: this.$route.matched,
    };
  },
};
</script>