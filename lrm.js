const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()
app.use(cors())
let excludedList = []
let jobs = []
let wait = false
let maxRooms = 800
let unique = {}
let AddException = str =>{
    excludedList.push(str)
    excludedList = [...new Set(excludedList)]
}
let createJob = (res,response)=>{
    wait = true
    const {data} = res
        let result = data
        result = result.filter(r=>(r.currentPlayers ==1 && isNotInsideExcludedList(r.serverId)))
        console.log(result)
        if(result.length >0){
            console.log(result[0])
            //excludedList.push(result[0].serverId)
            AddException(result[0].serverId)
            wait = false
            response.send(result[0].serverId)
        }else{
            wait = false
            console.log(result[0])
            response.send("")

        }
}
let isNotInsideExcludedList= str =>{
    let status = true
    for(let i = 0;i<excludedList.length;i++){
        if(str === excludedList[i]){
            status = false
            break
        }
    }
    if(excludedList >= maxRooms){
        excludedList = []
    }
    return status
}
app.get('/addexc/:id',(req,res)=>{
    while(wait){

    }
    const {id} = req.params
    excludedList.push(id)
    res.send('added')
})
app.get('/exc',(req,res)=>{
    excludedList = [...new Set(excludedList)]
    res.send(excludedList)
})
app.get('/',(req,response)=>{
    axios.get('http://localhost:5001/api/servers').then(res=>{
        while(wait){

        }
        createJob(res,response)
    })
})
app.listen(3001,()=>console.log('server started'))