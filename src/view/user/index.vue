<template>
    <normal-table :namespace="'/rest/users'"/>
</template>

<script>
    import NormalTable from "../../components/NormalTable";

    export default {
        name: "index",
        components: {NormalTable}
    }
</script>

<style scoped>

</style>
