<script setup>
    import { useRoute } from 'vue-router';
    const { meta: data } = useRoute();
</script>

<template>
    <div class="panelContainer">
        <div class="panel-lead">
            <div class="title">
                {{ data.name }}
            </div>
            <div class="describe">
                {{ data.describe }}
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .panelContainer {
        background-color: rgb(212, 212, 212);
        margin-bottom: 20px;

        .panel-lead {
            padding: 10px;

            .title {
                padding: 10px 0;
                font-size: 26px;
                font-weight: bold;
            }
            .describe {
                padding: 10px 0;
            }
        }
    }
</style>
