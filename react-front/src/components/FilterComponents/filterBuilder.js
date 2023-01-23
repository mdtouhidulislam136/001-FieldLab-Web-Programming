
export default function filterBuilder(data){

let signalInd = 0

const signalNameCategory = (string) => {
    let tempstring = string
    for(var i = 1; i < string.length; i++){
        if(string.charAt(i) === string.charAt(i).toUpperCase()){
            tempstring = tempstring.slice(0, i)
            break;
        }
    }
    return tempstring
}

const logicBuilder = (object, filt, list, path, props, i, filtlist, tempPath) => {
    const tempFiltList = [...filtlist, tempPath]
    i++
    list.forEach((element, inde) => {
        object[props[i][1]][path + '/' + props[i][1]].push({
            name: element,
            state: true,
            path: [props[i][1], path, `/${props[i][1]}`, inde],
            filterlist: []
        })
        if(i < (props.length - 1)){
        object[props[i][1]][path + '/' + props[i][1]][inde].filterlist.push([props[i + 1][1], `${path}/${element}/${props[i + 1][1]}`])
        const newfilter = (props[i][1] === "types" ? filt.filter((fil) => `${fil.machine_type} ${fil.machine_number}` === element) : filt.filter((fil) => fil[[props[i][0]]] === element))
        const newlist = (props[i][1] === "machines" ? [...new Set(newfilter.map((m) => `${m.machine_type} ${m.machine_number}`))].sort() : [...new Set(newfilter.map((m) => m[props[(i + 1)][0]]))].sort())
        tempFiltList.forEach((f) => {
            object[f[0]][f[1]][f[2]].filterlist.push([props[i + 1][1], `${path}/${element}/${props[i + 1][1]}`])
        })
        const newTempPath =  [`${props[i][1]}`, `${path}/${`${props[i][1]}`}` , inde]
        const newpath = path + '/' + element
        object[props[(i + 1)][1]][newpath + '/' + props[(i + 1)][1]] = []
        logicBuilder(object, newfilter, newlist, newpath, props, i, tempFiltList, newTempPath)
        if(props[i][1] === "measure"){
            object[props[i][1]][path + '/' + props[i][1]][inde].categories = [...new Set(object[props[(i + 1)][1]][newpath + '/' + props[(i + 1)][1]].map((m) => m.category))].sort()}
        }
        else{
            const category = signalNameCategory(element)
            object[props[i][1]][path + '/' + props[i][1]][inde].category = category
            object[props[i][1]][path + '/' + props[i][1]][inde].signalId = signalInd
            object[props[i][1]][path + '/' + props[i][1]][inde].filterlist = null
            signalInd++
        }
    })
}

        const categoryList =[["city", "cities"],
            ["place", "places"],
            ["machine", "machines"],
            ["", "types"],
            ["machine_module", "modules"],
            ["meas_name", "measure"],
            ["signal_name", "signals"]]


        const categories = {cities: {}, places:{}, machines:{}, types:{}, modules:{}, measure: {}, signals: {}}


        const pureData =  data.filter((f) => (
                    f.city !== null &&
                    f.place !== null &&
                    f.machine !== null &&
                    f.machine_type !== null &&
                    f.machine_module !== null &&
                    f.meas_name !== null &&
                    f.signal_name !== null))

        const citylist = [...new Set(pureData.map((d) => d.city))]
        citylist.forEach((c, cind) => {
            const topfilt = pureData.filter((fil) => fil.city === c)
            const toplist = [...new Set(topfilt.map((d) => d.place))]
            categories.cities[c] = []
            categories.cities[c].push({
                name: c,
                state: true,
                path: ["cities", c, "", cind],
                filterlist: [["places", `${c}/places`]]})
            categories.places[`${c}/places`] = []
            let topPath = c
            const nestfilt = []
            const topTempPath = ["cities", c , cind]
            logicBuilder(categories, topfilt, toplist, topPath, categoryList, 0, nestfilt, topTempPath)
        })
        return categories




}