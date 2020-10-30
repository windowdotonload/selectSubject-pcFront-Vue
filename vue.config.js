module.exports = {
    devServer: {
        proxy: {
            // 'http://127.0.0.1:7001/'
            '/': {
                target: 'http://127.0.0.1:7001/',
                changeOrigin: true
            }
        }
    }
}