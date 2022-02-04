//https://www.douban.com/note/820535382/?_i=1813663IKj5hQ-

// 7:48px
// 6:32px
// 5:24px
// 4:18px
// 3:16px
// 2:13px
// 1:9px



const transformLineBreak = (html) => {
    return html.replace(/\n\s*/g, '');
}

const transformFontTag = (html) => {
    const mapFontToPx = [
        0, 9, 13, 16, 18, 24, 32, 48
    ]
    //new RegExp内空格不用\s，改为直接空格，\d要改为\\d
    // const array = new RegExp("<font size=\"\\d*\">",'g').exec(htmlSource.html);
    let pattern = /<font\ssize=\"(\d*)\">(.*?)<\/font>/g;//g这些标志位用在replace的时候
    return html.replace(pattern, (val, p1, p2) => {
        // let str = val.match(/<font\ssize=\"\d*\">/g);
        // let px = mapFontToPx[parseInt(str[0].split('\"')[1])];
        // return val.replace(pattern,"<p style='font-size:"+px+"px'>$4</p>")
        return "<div style='font-size:" + mapFontToPx[p1] + "px'>" + p2 + "</div>"
    })
}

export let imgs = [];

const transformImgs = (html)=>{
    imgs = [];
    let index = -1;
    let pattern = /<img\ssrc=\'(.*?)\'\/>/g;
    return html.replace(pattern,(val,p1)=>{
        index++;
        imgs.push({url:p1,props:{}});//{url:v,props:{}}
        return "<img index='"+index+"' src='"+p1+"'/>"
    })
}

export const transformHtml = (html) =>{
    let internalHtml = html != undefined ? html : htmlSource.html;
    internalHtml = transformLineBreak(internalHtml);//测试用，正式运行时，要删去
    internalHtml = transformFontTag(internalHtml);
    internalHtml = transformImgs(internalHtml);

    return internalHtml;
}

const htmlSource = {
    html: `版权归作者所有，任何形式转载请联系作者。<div>作者：精神文明創世神（来自豆瓣）</div><div>来源：<a href="https://www.douban.com/note/820535382/">https://www.douban.com/note/820535382/</a></div><div><br></div><div>爱好拍
    照的朋友会经常遇到一个问题，就是无法同时把远处和近处的物体拍的清晰，对焦远点，近处物体变模糊，对焦近处，远距离的物
    体又会看不清，专业视觉领域会把这类问题称为成像系统的景深限制。</div><div>如果想亲身体验一下这个场景，可以闭上一只眼
    ，把指头放在鼻子前，另一只眼睛盯着指头，这时远处的物体似乎出现了重影；而盯着远处物体时，近处的指头又会变得边缘模糊
    。</div><div>我们能不能说，模糊的指头就是指头本身的形状呢，指头是不是以“概率云”的形式，依照波函数的概率存在于模糊
    像所覆盖的空间呢？显然不能，因为指头出现模糊只是由于三维信息降维到二维平面时，由于成像焦距的问题导致多个二维投影不
    能精确重合，于是出现了类似“概率云”的现象。</div><div>那么同理，把四维空间信息投影到三维空间时，如果多个三维投影不
    能精确重合，会出现何种状态？</div><div>科学家们说：“物质会以波函数的形式，同时出现在一片空间里，空间内的概率密度总
    和为1”。这些人后来发明了量子力学，写出了一堆很不亲民的公式来研究那些由于“对焦”问题出现的“重影”和“模糊”，也即
    物质空间波的分布函数。个人认为，这些研究对于人类整体意识的贡献有限，不如去研究如何利用意识聚焦形成清晰的世界像，从
    而将更本质的世界真相化作深刻的认知，促进集体意识的进化，进而解决物质世界的种种现实问题。</div>
    <img src='https://img3.doubanio.com/view/note/l/public/p86171360.webp'/>
    <div style="text-align: center;">离焦模糊和电子云均是一种“高维信息形成的多个低维投影不重合”引起的弥散现象</
div><div style="text-align: center;"><br></div><div>后来人们进行了光子的双缝干涉实验，发现在人们不观测光子路径时，
打到屏幕上的光子出现干涉条纹，从而呈现波动性，一旦拿高速摄像机观察到了光子具体从哪个缝穿过，光子又立刻呈现了粒子性
，干涉条纹消失了。于是，当人类终于学会将意识对焦的时候，他们却将其解释为“量子叠加态的坍缩”。</div>
<img src='https://img1.doubanio.com/view/note/l/public/p86171369.webp'/>
<div style="text-align: center;"><span style="font-size: 1em;">双缝干涉实验示意图，当人们用高速摄像机拍
摄光子具体经过了哪个缝隙时，右侧屏幕上的干涉条纹消失，变成了单纹</span></div><div style="text-align: center;"><span style="font-size: 1em;"><br></span></div><div><div>光究竟是波还是粒子呢？</div><div>其实波粒二象性是意识在频率维度
上是否对焦而形成的两种现象：体现波动性的量子叠加态，是频率维度上未对焦形成的高维“模糊”；体现粒子性的叠加态坍缩，
是意识在频率维度对焦后形成的清晰成像。这和观测手指时的模糊清晰两种结果是相似的原理，只是对焦的维度不同。</div></div>
<img src='https://img9.doubanio.com/view/note/l/public/p86229335.webp'/>
<div style="text-align: center;"><span style="font-size: 1em;">双缝干涉实验中，对穿过其中一个缝隙的粒子（物质
波）进行观测，用不同的意识频率，观察结果完全不同。波动态的多条纹结果等效于成像系统的离焦现象（成像为弥散斑），粒子
态的单条纹结果对应于成像系统的理想对焦（成像为清晰的点）</span><br></div><div style="text-align: center;"><span style="font-size: 1em;"><br></span></div><div>注意力即是意识的聚焦，其所形成的觉察如同一个可调节焦距的透镜，充分的觉察
如同把透镜调节到了正确的焦距，使物质的像平面恰好与感光面重合，形成清晰的像。以双缝干涉为例，其微观过程是：当意识觉
察到到光子将要从哪个缝中穿过时，观察者就将意识在频率维度对焦到光子上，并将意识的振动频率（采样频率）调节对应到光子
的振动频率，最后使得意识每次采样光子的位置时，光子也恰好振动到同一个相位，于是光子就被观测成了粒子，失去了干涉条纹
。以上也即同步性原理。</div><div>利用这个原理，我们可以主动选择在物质世界的观测结果。说到底，不过是调节好频率让物质
清晰“成像”的前提下，在物质振动的区间内选出一个自己所期望看到的相位，从而主动“改造”物质的形态，这个感觉类似清醒
梦的控梦体验。</div><div>高维空间万事已定，低维观测结果可以凭本事选择，相信即存在不是一句空话。</div>
    `
}