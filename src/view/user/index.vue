<template>
    <crud-table :namespace="'/rest/users'"/>
</template>

<script>
    import CrudTable from "../../components/CrudTable";

    export default {
        name: "index",
        components: {CrudTable}
    }
</script>

<style scoped>

</style>
