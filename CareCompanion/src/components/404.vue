<script setup>
    import { useRouter } from 'vue-router';
    const router = useRouter();
</script>

<template>
    <el-row justify="center" align="middle" style="height: 100%">
        <el-col>
            <el-result icon="error" title="404 - file not found" sub-title="抱歉，当前页面不存在">
                <template #extra>
                    <el-button type="primary" style="width: 160px" @click="router.back()">返回上一页</el-button>
                </template>
            </el-result>
        </el-col>
    </el-row>
</template>

<style lang="less" scoped>
    :deep(.el-result__title) {
        p {
            font-size: 26px;
        }
    }
    :deep(.el-result__subtitle) {
        p {
            font-size: 32px;
        }
    }
</style>
