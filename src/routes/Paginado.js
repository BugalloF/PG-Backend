function paginado (modelo,query){
    const registerpp = 6;
  
    const [obras, total] = await Promise.all([
      modelo.findAll({ limit: registerpp, offset: query * registerpp }),
      modelo.count(),
    ]);
    // const obras = await  Artwork.findAll({limit:3,skip:0})
    // const total = await Artwork.count()
  
    return res.json({
      ok: true,
      msg: "Pag",
      obras,
      page: {
        from,
        registerpp,
        total,
      },
    });
}
module.exports= paginado