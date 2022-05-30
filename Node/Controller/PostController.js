
const postdb=require('../Model/post')
const Userdb = require('../Model/user')
const userpost=((req,res)=>{
    return new Promise((resolve,reject)=>{
        Userdb.findOne({userid:req.params.id}).then((userdata)=>{
            console.log(userdata);
            const post=new postdb({
                Name:userdata.Firstname,
                userid:userdata.userid,
                Description:req.body.desc,
                Image:req.body.img,
            })
            post.save(post).then((result)=>{
                resolve(result)
            }).catch(err=>{
                reject({sucess:false,message:'userid error'})
            })
        })
    })
})
const postbyid=((req,res)=>{
    return new Promise((resolve,reject)=>{
        postdb.find({userid:req.params.id}).then((userpost)=>{
            resolve(userpost)
        }).catch(err=>{
            console.log(err);
            reject({sucess:false,message:'userid deos not exists',err:err})
        })
    })
})
const deletepost=((req,res)=>{
    return new Promise((resolve,reject)=>{
        const id=req.params.id
        postdb.findByIdAndDelete(id).then((result)=>{
            resolve(resolve)
        }).catch(err=>{
            reject({Succes:false,message:'Error on deletion'})
        })
    })
})
const updatepost=((req,res)=>{
    return new Promise((resolve,reject)=>{
        postdb.findOne({_id:req.params.id}).then(async(post)=>{
            if(!post){
                reject({sucess:false,message:'user id not found'})
            }
           const data=({
               Description:req.body.desc
           })
         await   postdb.findByIdAndUpdate(req.params.id,data).then((result)=>{
               resolve(result)
           }).catch(err=>{
                reject({sucess:false,message:'error on updating the post',Err:err})
           })
           
        }).catch(err=>{
            reject(err)
        })
    })
})
const timeline=((req,res)=>{
    return new Promise(async(resolve,reject)=>{
        const cuser=await Userdb.findOne({userid:req.body.userid}) 
        const userpost=await postdb.find({userid:req.body.userid})
        const friendPosts = await Promise.all(
        await cuser.Followings.map((frndid)=>{
        return  postdb.find({userid:frndid})
        })  
        )
        console.log(friendPosts);
        resolve(userpost.concat(...friendPosts))
    })
})
const likepost=((req,res)=>{
    return new Promise(async(resolve,reject)=>{
        const user= await Userdb.findOne({userid:req.params.userid})
        const userpost= await postdb.findById({_id:req.params.id})
        if(!userpost.Likes.includes(req.params.userid)){
            await userpost.updateOne({$push:{Likes:req.params.userid}})
            resolve(userpost)
        }else{
            await userpost.updateOne({$pull:{Likes:req.params.userid}})
            reject({sucess:false,message:'you disliked the post'})
        }     
    })
})
const comment=((req,res)=>{
    return new Promise(async(resolve,reject)=>{
        const user=await Userdb.findById(req.params.userid)
        const userpost=await postdb.findById(req.params.id)
        const data=({
            userid:user.userid,
            comment:req.body.comment
        })
        console.log(data);
        await userpost.updateOne({$push:{Comments:data}}).then((result)=>{
            resolve(result)
        }).catch(err=>{
            console.log(err);
            reject({Succes:false,message:"Error on commenting"})
        })
    })
})
module.exports={userpost,postbyid,deletepost,updatepost,timeline,likepost,comment}