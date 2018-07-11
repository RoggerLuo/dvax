import test from 'tape'
const _test =  (title,body) => {
    test(title,(t)=>{
        body(subTopic)
        t.end()
        function subTopic(subTitle,subBody){
            t.equal(subBody(),true,subTitle)
        }
    })
}
export default _test
