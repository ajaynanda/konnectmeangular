const route=require('express').Router()
const Controller=require('../Controller/PostController')
route.post('/userpost/:id',((req,res)=>{
    Controller.userpost(req,res).then((result)=>{
        res.status(200).json({Success:true,message:'User post has been made',data:result})
    }).catch((err)=>{
        console.log(err);
        res.status(400).json(err)
    })
}))
route.get('/postbyuserid/:id',((req,res)=>{
    Controller.postbyid(req,res).then((result)=>{
        res.status(200).json({Success:true,message:'userpost data',data:result})
    }).catch((err)=>{
        console.log(err);
        res.status(400).json(err)
    })
}))
route.put('/updatepost/:id',((req,res)=>{
    Controller.updatepost(req,res).then((result)=>{
        res.status(200).json({Success:true,message:'User post has been updated',data:result})
    }).catch((err)=>{
        console.log(err);
        res.status(400).json(err)
    })
}))
route.delete('/deletepost/:id',((req,res)=>{
    Controller.deletepost(req,res).then((result)=>{
        res.status(200).json({Success:true,message:'User post has been deleted',data:result})
    }).catch((err)=>{
        console.log(err);
        res.status(400).json(err)
    })
}))
route.get('/timeline/:userid',((req,res)=>{
    Controller.timeline(req,res).then((result)=>{
        res.status(200).json({Success:true,message:"data",data:result})
    }).catch(err=>{
        console.log(err)
        res.status(400).json(err)
    })
}))
route.get('/like/:userid/:id',((req,res)=>{
    Controller.likepost(req,res).then((result)=>{
        res.status(200).json({Success:true,message:"You have liked the post",data:result})
    }).catch(err=>{
        console.log(err)
        res.status(400).json(err)
    })
}))
route.get('/comment/:userid/:id',((req,res)=>{
    Controller.comment(req,res).then((result)=>{
        res.status(200).json({Success:true,message:"You commment on the post",data:result})
    }).catch(err=>{
        console.log(err)
        res.status(400).json(err)
    })
}))
module.exports=route