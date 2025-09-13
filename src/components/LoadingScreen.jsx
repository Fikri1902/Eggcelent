import EggLogo from "./EggLogo";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg">
            <EggLogo className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Eggcelent</h1>
        <p className="text-gray-600">Sistem Peternak Telur</p>
        <div className="mt-8">
          <div className="w-32 h-1 mx-auto bg-gray-300 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}