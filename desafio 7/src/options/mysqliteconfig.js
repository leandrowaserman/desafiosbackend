const sqlOptions = {
    client:'sqlite3',
    connection:{
        filename:'./src/db/messages.sqlite'
    },
    useNullAsDefault:true
}
export default sqlOptions