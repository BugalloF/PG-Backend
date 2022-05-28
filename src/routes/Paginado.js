module.exports= paginado = async function (modelo,query = 0){
    const registerpp = 6;
    query = parseInt(query)
    const [obras, total] = await Promise.all([
      modelo.findAll({ limit: registerpp, offset: query * registerpp }),
      modelo.count(),
    ]);
    // const obras = await  Artwork.findAll({limit:3,skip:0})
    // const total = await Artwork.count()
  
    return {
      ok: true,
      msg: "Pag",
      obras,
      page: {
        from,
        registerpp,
        total,
      },
    };
}