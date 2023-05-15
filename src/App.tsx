import { useEffect, useState } from 'react';

// 投资金额 0-1000w 非线性,1-200w最小精度10w,200w以上最小精度100w
const amountList = Array(20)
    .fill('$')
    .map((_, index) => index + 1)
    .map((i) => i * 10)
    .concat(
        Array(8)
            .fill('$')
            .map((_, index) => index + 3)
            .map((i) => i * 100)
    );

const defaultAmount = 100;
const maxAmount = 1000;

// 投资时间 6个月/12个月/18个月/24个月/36个月 非线性,只提供5个选择

const monthList = [6, 12, 18, 24, 36];
const defaultMonth = 6;
const maxMonth = 36;

function Pentagram() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
        </svg>
    );
}

export interface Data {
    敲出止盈类?: GeneratedType[];
    净值类?: GeneratedType2[];
}

export interface GeneratedType {
    group: string;
    score: number;
    probability: number;
    noteList: NoteList[];
    productList: string[];
}

export interface NoteList {
    message: string;
    star: number;
    probability: number;
}

export interface GeneratedType2 {
    group: string;
    score: number;
    probability: number;
    noteList: NoteList2[];
    productList: string[];
}

export interface NoteList2 {
    message: string;
    star: number;
    probability: number;
}

function fetchData(month: string | number, amount: number): Promise<Data> {
    return fetch(`/getCard?month=${month}&amount=${amount * 10000}`).then((res) => res.json());
}

function App() {
    const [amount, setAmount] = useState(defaultAmount);
    const [month, setMonth] = useState(defaultMonth);
    const [data, setData] = useState<any | Data>(null);

    useEffect(() => {
        fetchData(month, amount)
            .then((json) => {
                console.log(json);
                setData(json);
            })
            .catch(console.log);
    }, [month, amount]);

    return (
        <>
            <div className="w-full h-[100vh] px-4 pt-6 font-light bg-[#fef7ec]">
                <div className="pl-1 text-sm ">客户有一百万，希望投资一年，哪些产品可以推荐？</div>
                <div className="h-5 pr-3 flex flex-row items-center justify-stretch mt-3 pl-1 text-sm">
                    <span>投资金额</span>
                    <div
                        onClick={(e) => {
                            const { left, width } = (e.target as HTMLElement).getBoundingClientRect();
                            const x = e.clientX - left;
                            const percent = x / width;
                            const currentPercent = amount / maxAmount;
                            const index = amountList.indexOf(amount);
                            if (currentPercent > percent && index > 0) {
                                setAmount(amountList[index - 1]);
                            }
                            if (percent > currentPercent && index < amountList.length - 1) {
                                setAmount(amountList[index + 1]);
                            }
                        }}
                        className="relative ml-2 flex-1 flex flex-row items-center"
                    >
                        <div className="w-full h-2 rounded-full bg-[#e8cab2]"></div>
                        <div
                            style={{
                                left: `${(amount / maxAmount) * 100}%`,
                            }}
                            className="absolute px-1.5 text-xs text-white top-1/2 rounded-[8px] -translate-y-1/2 -translate-x-1/2 bg-[#ba6020]"
                        >
                            {amount}w
                        </div>
                    </div>
                </div>
                <div className="h-5 pr-3 flex flex-row items-center justify-stretch mt-3 pl-1 text-sm">
                    <span>投资时间</span>
                    <div
                        onClick={(e) => {
                            const { left, width } = (e.target as HTMLElement).getBoundingClientRect();
                            const x = e.clientX - left;
                            const percent = x / width;
                            const currentPercent = month / maxMonth;
                            const index = monthList.indexOf(month);
                            if (currentPercent > percent && index > 0) {
                                setMonth(monthList[index - 1]);
                            }
                            if (percent > currentPercent && index < monthList.length - 1) {
                                setMonth(monthList[index + 1]);
                            }
                        }}
                        className="relative ml-2 flex-1 flex flex-row items-center"
                    >
                        <div className="w-full h-2 rounded-full bg-[#e8cab2]"></div>
                        <div
                            style={{
                                left: `${(month / maxMonth) * 100}%`,
                            }}
                            className="absolute px-1.5 whitespace-nowrap text-xs text-white top-1/2 rounded-[8px] -translate-y-1/2 -translate-x-1/2 bg-[#ba6020]"
                        >
                            {month}个月
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <h1 className=" text-2xl ">回答</h1>
                    {data && data['敲出止盈类'] && (
                        <div className="mt-5 pl-2">
                            <div className="text-xs">敲出止盈类</div>
                            <div className="mt-1 flex flex-row overflow-scroll">
                                {(data['敲出止盈类'] as GeneratedType[]).map((item, index) => {
                                    return (
                                        <div key={index} className="first:ml-0 ml-6 pt-3 px-3 flex-shrink-0 flex flex-col w-[200px] h-[180px] text-xs rounded-3xl bg-white">
                                            <div>{item.group}</div>
                                            {item.noteList.map((i, index) => {
                                                return (
                                                    <div className="pt-3 pl-2" key={index}>
                                                        {i.message}
                                                    </div>
                                                );
                                            })}
                                            <div className="mt-4 w-full h-[1px] bg-[#a8a8a8]"></div>
                                            <div className="pl-2 flex-1 flex flex-row items-center">{item.productList && item.productList[0] && item.productList[0]}</div>
                                        </div>
                                    );
                                })}
                                {/* <div className="flex-shrink-0 w-[200px] h-[180px] rounded-3xl bg-white"></div>
                                <div className="ml-6 flex-shrink-0 w-[200px] h-[180px] rounded-3xl bg-white"></div>
                                <div className="ml-6 flex-shrink-0 w-[200px] h-[180px] rounded-3xl bg-white"></div>
                                <div className="ml-6 flex-shrink-0 w-[200px] h-[180px] rounded-3xl bg-white"></div> */}
                            </div>
                        </div>
                    )}
                    <div className="mt-5 pl-2">
                        <div className="text-xs">净值类</div>
                        <div className="mt-1 flex flex-row overflow-scroll">
                            {Array(3)
                                .fill('$')
                                .map((_, index) => {
                                    return (
                                        <div key={index} className="ml-6 first:ml-0 flex-shrink-0 w-[232px] h-[300px] rounded-3xl bg-white">
                                            <div className="w-3 h-3">
                                                <Pentagram />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
