<script>
import publicContiner from "@/views/publicContiner";
import { teacher } from "@/router/index.js";

export default {
  extends: publicContiner,
  data() {
    return {
      logintype: "teacher",
      menuData: teacher,
      breadData: this.$route.matched,
    };
  },
};
</script>