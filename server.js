const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()
app.use(cors())
let excludedList = []
let isNotInsideExcludedList= str =>{
    let status = true
    for(let i = 0;i<excludedList.length;i++){
        if(str === excludedList[i]){
            status = false
            break
        }
    }
    return status
}
app.get('/exc',(req,res)=>res.send(excludedList))
app.get('/',(req,response)=>{
    axios.get('http://localhost:8081/api/servers').then(res=>{
        const {data} = res
        let result = data
        result = result.filter(r=>(r.currentPlayers == 1 && isNotInsideExcludedList(r.serverId)))
        console.log(result)
        if(result.length >0){
            console.log(result[0])
            excludedList.push(result[0].serverId)
            response.send(result[0].serverId)
        }else{
            console.log(result[0])
            response.send("")

        }
                /*
        if(result != undefined){
            result = result.filter(r=>r.currentPlayers == 1)
            result = result[0]
            console.log(result)
            if(result['serverId']){
                const {serverId} = result
                 response.send(serverId)
            }else{
                response.send("")
            }
            
        }else{
            response.send("")
        }*/
    })
})
app.listen(3002,()=>console.log('server started'))