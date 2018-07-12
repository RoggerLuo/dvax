const Xss = dvaStatic.Xss
dva.test('Xss', (t) => {
    const string = 'test<a>testatesta'
    t('translated string',()=>{
        return Xss.escape(string) === 'test&lt;a&gt;testatesta' 
    })
    const note = { content:'test<a>testatesta' }

    t('translated object',()=>{
        return Xss.escape(note).content === 'test&lt;a&gt;testatesta' 
    })
    t('Xss不会改变原来的object',()=>{
        const newNote = Xss.escape(note)
        return note.content === 'test<a>testatesta'
    })

})