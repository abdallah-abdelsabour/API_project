const express = require('express')
const news_Router=require('./routers/news.js')
const reporters_Router=require('./routers/reporters.js')

require('./db/mongoose') 
const app = express()
app.use(express.json())

app.use((req,res,next)=>{
    next()
})

app.use(news_Router)
app.use(reporters_Router)


app.listen(8080,()=> {
    console.log('server is running')})