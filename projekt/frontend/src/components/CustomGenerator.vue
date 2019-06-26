<template></template>

<script>
export default {
  mounted() {
    let th = this;
    this.$gen
      .get("http://10.10.4.71:3000/db")
      .then(function(response) {
        // handle success
        const params = new URLSearchParams();
        params.append("horses", JSON.stringify(response.data.horses));
        params.append("classes", JSON.stringify(response.data.classes));
        params.append("referees", JSON.stringify(response.data.referees));
        let refereesCount = response.data.referees.length;
        let horsesCount = response.data.horses.length;
        let classesCount = response.data.classes.length;
        console.log(response.data);
        th.$http
          .post("clear", params)
          .then(response => {
            th.$store.dispatch(
              "loadMessage",
              "Dane z generatora zostały zaimportowane. " +
                refereesCount +
                " sędziów, " +
                horsesCount +
                " koni, " +
                classesCount +
                " klas"
            );
          })
          .catch(errors => {
            console.log(errors);
          });
      })
      .catch(errors => {
        alert("Proszę włączyć generator");
      });
    this.$router.push("home");
  }
};
</script>