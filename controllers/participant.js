import mongoose from 'mongoose';
import  ParticipantModel  from '../models/participant.js';

const create = async (req, res, next)=> {
    const _participant = new ParticipantModel({
        _id: new mongoose.Types.ObjectId(),
        ...req.body
    });
    try {
        const participant= await  _participant.save()
        if(participant){
            return res.status(201).json({
                success:true,
                message: 'Create participant successful',
                data: participant,
            })
        }
        return res.status(404).json({
            success:false,
            message: 'create participant not successful',
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
        await ParticipantModel.find()
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
            message: 'create participant not successful',
        })
           
    }

};

const getOne = async(req, res, next)=> {
    try {
        const participant= await ParticipantModel.findById(req.params.id)
        if(participant){
            return res.status(200).json({
                success:true,
                message: 'get one participant successful',
                data: participant,
            })
        }
        return res.status(404).json({
            success:false,
            message: 'get one participant not successful',
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
        const participant= await ParticipantModel.findByIdAndUpdate({_id: req.params.id},req.body,{new: true})
        if(participant){
            return res.status(200).json({
                success:true,
                message: 'update participant successful',
                data: participant,
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
        const participantDie= await ParticipantModel.findByIdAndDelete(req.params.id)
        if(participantDie){
            return res.status(200).json({
                success:true,
                message: 'remove one participant successful',
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




const getRoomIdsByPage = async(req, res, next) => {
    const pageOptions = {
        page: +req.params.page || 0,
        limit: +req.params.limit || 10
    }
    
    try {
        const roomIds = await ParticipantModel.find({userId: req.params.userId},null,
        {sort:{updatedAt:-1}, skip:pageOptions?.page * pageOptions?.limit, limit:pageOptions?.limit})
        if(roomIds.length==0) return res.status(200).json([])
        req.body.roomIds =roomIds.map(item=>item.roomId)
        next()
      
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'create participant not successful',
        })
           
    }

};

const getInfoForRoom=async(roomId, userId)=>{
        const participants = await ParticipantModel.find({roomId:roomId},null,{sort:{updatedAt:-1},limit:2,where: {userId:{ $ne: userId }}})
        .populate(
            {
                path: 'userId',
                select: 'avatar username',
                
            }).lean()
        let avatar=[]
        let name=''
        if(participants.length==1){
            let a
            a= participants[0].userId
            name=a?.username
            avatar=[a?.avatar]
        }
        else if(participants.length>1){
            let a,b
            a= participants[0].userId
            b= participants[1].userId
            name=a?.username+', '+b?.username+ (participants.length>2? '..':'')
            avatar=[a?.avatar, b?.avatar]
        }
        
        return {avatar,name}
}

// sap xep lai cho phong co tin nhan moi noi len tren
const updateOder= async(roomId) =>{
    let update= Date.now().toString()
    try {
       const x= await ParticipantModel.updateMany({roomId: roomId},{updatedAt:update},{new: true})
    } catch (error) {
      console.error(error)
    }
}


const getInfoUserOfRoom=async(roomId, userId)=>{
    const participants = await ParticipantModel.find({roomId:roomId},null,{sort:{updatedAt:-1},limit:2,where: {userId:{ $ne: userId }}})
    .populate(
        {
            path: 'userId',
            select: 'avatar username phone',
        })
    if(participants.length==1){
        let a
        a= participants[0].userId
        const {_id,avatar,phone, username:name}= a
        return {_id, avatar, phone, name}
    }
    else return null
}

const getParticipantIds=async(roomId)=>{
    try {
        const participants = await ParticipantModel.find({roomId:roomId}).distinct('userId')
        return participants
    } catch (error) {
        console.log(error);
        return 
    }
    
}

const createMultiple=async(req, res, next)=>{
    if(req.body?.isHaveRoom==true){
        next()
        return
    }
    let roomId= req.body.roomId
    let arr=[]
    if(req.body?.userIds){
        const userIds= req.body.userIds
        for(let i = 0; i <userIds.length; i++){
            arr.push({
                userId:userIds[i],
                roomId:roomId
            })
        }
        try {
            const participant = await ParticipantModel.insertMany(arr)
            if(participant){
                next()
                return
            }
            return res.status(404).json({
                success:false,
                message: 'create participant not successful',
            })
         
        } catch (error) {
            return res.status(500).json({
                success:false,
                message: error.message,
            })
        }
    }
    else{
        next()
    }
}



export const createMultipleParticipants=async(data)=>{
   
    let roomId= data.roomId
    let arr=[]
    if(data?.userIds){
        const userIds= data.userIds
        for(let i = 0; i <userIds.length; i++){
            arr.push({
                userId:userIds[i],
                roomId:roomId
            })
        }
        try {
            const participant = await ParticipantModel.insertMany(arr)
            return true
        } catch (error) {
           return false
        }
    }
    else{
        return false
    }
}


const ParticipantsOfRoom= async(req, res)=>{
    try {
        const participants = await ParticipantModel.find({roomId:req.params.roomId}).select('userId, -_id')
        .populate(
            {
                path: 'userId',
                select: '-refreshToken -password',
                
        })
        if(!participants) { res.status(500).json({success:false}); return; };
        const data = participants.map(item=>item.userId)
        return  res.status(200).json({
                success:true,
                message: `get success`,
                data
            })
    } catch (error) {
        res.status(500).json({success:false, error}); return;
    }
    
}

export default {
    create, 
    getByPage,
    getOne, 
    update, 
    remove,
    getRoomIdsByPage,
    getInfoForRoom,
    updateOder,
    getInfoUserOfRoom,
    getParticipantIds,
    createMultiple,
    ParticipantsOfRoom
};
