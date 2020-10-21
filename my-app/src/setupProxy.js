const { createProxyMiddleware } = require('http-proxy-middleware');

const context = ['/querySemester','/queryClassTask','/uploadExcel','/classScheduling','/queryCoursePlan']
const options = {
    target: 'http://localhost:8085',
    changeOrigin: true
}
module.exports = function (app) {
    app.use(createProxyMiddleware(context,options))
};
