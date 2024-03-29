import mongoose from 'mongoose';
import MessageModel  from '../models/message.js';
import participantController from './participant.js';

const create = async (req, res, next)=> {
    participantController.updateOder(req.body.roomId)
    let id = new mongoose.Types.ObjectId();
    if(req?.body?._id){
        id= req.body._id
    }
    const _message = new MessageModel({
        _id:id,
        ...req.body
    });
    try {
        const message= await  _message.save()
        if(message){
            return res.status(201).json({
                success:true,
                message: 'Create message successful',
                data: message,
            })
        }
        return res.status(404).json({
            success:false,
            message: 'create message not successful',
        })
     
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }
    
};

const getByPage = async(req, res) => {
    const pageOptions = {
        page: +req.params.page || 0,
        limit: +req.params.limit || 10
    }
    
    try {
        await MessageModel.find()
        .skip(pageOptions?.page * pageOptions?.limit)
        .limit(pageOptions.limit)
        .exec(function (err, doc) {
        if(err) { res.status(500).json(err); return; };
        return  res.status(200).json({
                success:true,
                message: `get success`,
                data: doc,
            })
        });
      
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'create message not successful',
        })
           
    }

};

const getOne = async(req, res, next)=> {
    try {
        const message= await MessageModel.findById(req.params.id)
        if(message){
            return res.status(200).json({
                success:true,
                message: 'get one message successful',
                data: message,
            })
        }
        return res.status(404).json({
            success:false,
            message: 'get one message not successful',
        })
      
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }

};

const update = async(req, res, next)=> {
    try {
        const message= await MessageModel.findByIdAndUpdate({_id: req.params.id},req.body,{new: true})
        if(message){
            return res.status(200).json({
                success:true,
                message: 'updated message successful',
                data: message,
            })
        }
        return res.status(200).json({
            success:false,
            message: 'can not find',
        })
      
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }

};
const remove = async(req, res, next) => {
    try {
        const messageDie= await MessageModel.findByIdAndDelete(req.params.id)
        if(messageDie){
            return res.status(200).json({
                success:true,
                message: 'remove one message successful',
            })
        }
        return res.status(200).json({
            success:false,
            message: 'can not find',
        })
      
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }

};

// get danh sach cac phong kem tin nhan cuoi cung
const getMessagesByUserId=async(req, res)=>{
    const promiseArr=[]
    const roomIds =req.body.roomIds
    for(let i=0; i<roomIds.length; i++){
        const promise=  new Promise((resolve, reject)=>{
            const roomid=roomIds[i]
            let room =  MessageModel.findOne({roomId:roomid},null,{sort:{createdAt:-1}})
            .populate('roomId', 'name')
            .populate('readBy', 'username email avatar')
            .populate('userId', 'username')
            .lean()
            
            const participants =  participantController.getInfoForRoom(roomid, req.params.userId)
            Promise.all([room, participants]).then(([a1,a2] )=> {
                let result = {...a1,...a2}
                const {roomId, userId ,content, type, avatar, name, updatedAt,readBy} = result
                result={_id:roomId,userId,content, type, avatar, name,readBy, updatedAt}
                resolve(result)
            })
        })
        promiseArr.push(promise)
       
    }
    Promise.all(promiseArr).then(result => {
        result.sort((a,b) => {
            return roomIds.indexOf(a._id)-roomIds.indexOf(b._id)
        })
        return res.status(200).json(result)
    }).catch(err =>{
        return res.status(500)
    })
}

// lay cac tin nhan trong phong theo trang
const getMessagesByRoomId=async(req, res)=>{
    const pageOptions = {
        page: +req.params.page || 0,
        limit: +req.params.limit || 10
    }
    
    try {
        const messages =await MessageModel.find({roomId: req.params.roomId},null,
        {sort:{updatedAt:-1}, skip:pageOptions?.page * pageOptions?.limit, limit:pageOptions?.limit})
        .populate('readBy', 'username avatar').populate('userId', 'avatar username').lean()
        
        if(messages){
            return  res.status(200).json({
                success:true,
                message: `get success`,
                data: messages
            })
        }
        return res.status(500).json({err:"error"});
     
      
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'create message not successful',
        })
           
    }
}

const getRecentUsers=async(req, res)=>{
    let searchOption=''
    if(req.query.search && req.query.search!=''){
        let y=req.query.search
        let x=y.slice(0,1)[0]
        if(x==0||x==8){
            searchOption ='phone'
        }
        else{
            searchOption ='username'
        }
    }
    
    const rooms=[]
    const roomIds =req.body.roomIds
    const promiseArr=[]
    for(let i=0; i<roomIds.length; i++){
        const promise=  new Promise((resolve, reject)=>{
            const roomid=roomIds[i]
            let room =  MessageModel.findOne({roomId:roomid},null,{sort:{createdAt:-1}}).select('userId')
            .populate({
                path: 'roomId',
                select:'name',
            }).lean()
            const user =  participantController.getInfoUserOfRoom(roomid, req.params.userId)
            Promise.all([room, user]).then(([a1,a2] )=> {
                let result = {...a1,...a2}
                const {_id, roomId:{_id:roomId}, avatar, phone, name} =result
                result ={_id,roomId,avatar,phone,name}
                if(a2!=null){
                    rooms.push(result)
                }
                resolve(rooms)
            })

        })
        promiseArr.push(promise)
    }
    Promise.all(promiseArr).then(() => {
        let usersFilter = rooms
        if(searchOption!=''){
            const keySearch= req.query.search
            if(searchOption=='username'){
                usersFilter = usersFilter.filter((user)=>user.name.toLowerCase().indexOf(keySearch.toLowerCase()) >= 0)
            }
            else{
                usersFilter = usersFilter.filter((user)=>user.phone.toLowerCase().indexOf(keySearch.toLowerCase()) >= 0)
            }
        }
        usersFilter.sort((a,b) => {
            return roomIds.indexOf(a.roomId)-roomIds.indexOf(b.roomId)
        })

        return res.status(200).json(usersFilter)
    }).catch(err =>{
        return res.status(500)
    })
    
}




export const createMessage = async (data)=> {
    participantController.updateOder(data.roomId)
    let id= new mongoose.Types.ObjectId();
    if(data?._id){
        id= data._id
    }
    const _message = new MessageModel({
        _id:id,
        userId: data.userId._id ,
        ...data
    });
    try {
         await  _message.save()
        return true
    } catch (error) {
      return false
    }
    
};

export default {
    create,
    getByPage,
    getOne,
    update,
    remove,
    getMessagesByUserId,
    getMessagesByRoomId,
    getRecentUsers
 };
