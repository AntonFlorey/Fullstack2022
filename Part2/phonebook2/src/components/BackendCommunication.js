import axios from 'axios'

const GetServerData = (adress, ResponseHandler) => {
    axios.get(adress).then(response => {
        ResponseHandler(response)
    })
}

const UpdateServerData = (adress, data, ResponseHandler) => {
    axios.post(adress, data).then(response => {
        ResponseHandler(response)
    })
}

const DeleteServerData = (adress, id, ResponseHander, deleteMSG) => {
    if (window.confirm(deleteMSG)){
        axios.delete(adress + String(id)).then(response => {
            ResponseHander(response)
        })
    }
}

const PutServerData = (adress, data, ResponseHandler) => {
    axios.put(adress, data).then(response => {
        ResponseHandler(response)
    })
}

export {GetServerData, UpdateServerData, DeleteServerData, PutServerData}